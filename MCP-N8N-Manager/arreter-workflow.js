const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

const mcpServer = new Server(
  { name: 'arreter-workflow-n8n', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'arreter_workflow',
    description: 'Arrête toutes les exécutions en cours d\'un workflow N8N',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string', description: 'ID du workflow à arrêter' }
      },
      required: ['workflowId']
    }
  }]
}));

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { arguments: args } = request.params;
  const N8N_URL = 'http://192.168.1.26:5678';
  const JWT_TOKEN = 'VOTRE_JWT_TOKEN_N8N';
  
  try {
    // Recherche des exécutions en cours pour le workflow spécifié
    const runningResp = await axios.get(`${N8N_URL}/api/v1/executions`, {
      params: {
        filter: JSON.stringify({ workflowId: args.workflowId, status: 'running' }),
        limit: 10
      },
      timeout: 15000,
      headers: {
        'X-N8N-API-KEY': JWT_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const runningExecutions = runningResp.data.data || [];
    
    // Vérification de l'existence d'exécutions en cours
    if (runningExecutions.length === 0) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'aucune exécution en cours',
            workflowId: args.workflowId,
            message: 'Aucune exécution en cours trouvée pour ce workflow',
            executionsTrouvees: 0,
            executionsArretees: 0
          }, null, 2)
        }]
      };
    }

    // Arrêt séquentiel de toutes les exécutions en cours
    const stopResults = [];
    for (const execution of runningExecutions) {
      try {
        await axios.post(`${N8N_URL}/api/v1/executions/${execution.id}/stop`, {}, { 
          timeout: 15000,
          headers: {
            'X-N8N-API-KEY': JWT_TOKEN,
            'Content-Type': 'application/json'
          }
        });
        stopResults.push({ 
          executionId: execution.id, 
          statut: 'arrêté avec succès' 
        });
      } catch (e) {
        stopResults.push({ 
          executionId: execution.id, 
          statut: 'erreur', 
          details: e.message 
        });
      }
    }

    const successCount = stopResults.filter(r => r.statut === 'arrêté avec succès').length;

    // Rapport détaillé des opérations d'arrêt
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'opération terminée',
          workflowId: args.workflowId,
          executionsTrouvees: runningExecutions.length,
          executionsArretees: successCount,
          message: `${successCount}/${runningExecutions.length} exécution(s) arrêtée(s) avec succès`,
          resultatsDetailles: stopResults
        }, null, 2)
      }]
    };
  } catch (error) {
    throw new McpError(ErrorCode.InternalError, `Erreur lors de l'arrêt: ${error.message}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}

main().catch(console.error);
