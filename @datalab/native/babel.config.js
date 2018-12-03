module.exports = function(api) {
  const env = api.env() || 'development';

  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: ['@babel/plugin-transform-runtime', ['inline-dotenv', { path: `./.env.${env}` }]]
  };
};
