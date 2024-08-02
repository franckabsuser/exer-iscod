module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances: 3, // Lance 3 instances en parallèle
      exec_mode: "cluster", // Utilise le mode cluster pour la scalabilité
      max_memory_restart: "200M", // Redémarre l'application si elle dépasse 200 Mo de mémoire
      env: {
        NODE_ENV: "development", // Environnement de développement par défaut
      },
      env_production: {
        NODE_ENV: "production", // Environnement de production
      },
      log_file: "./logs/combined.log", // Fichier de log combiné pour stdout et stderr
      error_file: "./logs/err.log", // Fichier de log pour les erreurs
      out_file: "./logs/out.log", // Fichier de log pour stdout
      time: true // Ajoute des timestamps aux logs
    }
  ]
};
