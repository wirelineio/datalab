import PartnersDetail from '../../../containers/Partners/Detail';

export default {
  screen: PartnersDetail,
  navigationOptions: ({ navigation }) => ({
    title: `Partner: ${navigation.getParam('partner').name}`
  }),
  headerLeft: undefined
};
