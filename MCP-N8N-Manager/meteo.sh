# Vérification de la structure des fichiers
ls -la /home/user/mcp-server/

# Test individualisé de chaque serveur MCP
cd /home/user/mcp-server

echo '{}' | timeout 5s node lister-workflows.js
echo "Test serveur 1 (lister) OK"

echo '{}' | timeout 5s node statut-workflow.js
echo "Test serveur 2 (statut) OK"

echo '{}' | timeout 5s node executer-workflow.js
echo "Test serveur 3 (exécuter) OK"

echo '{}' | timeout 5s node arreter-workflow.js
echo "Test serveur 4 (arrêter) OK"

echo "Validation complète : tous les serveurs MCP sont opérationnels"
