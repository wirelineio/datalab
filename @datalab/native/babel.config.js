module.exports = function(api) {
  const env = api.env() || 'development';

  return {
    presets: ['babel-preset-expo'],
    plugins: ['@babel/plugin-transform-runtime', ['inline-dotenv', { path: `./.env.${env}` }]]
  };
};
