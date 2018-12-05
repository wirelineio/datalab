import PartnersDetail from '../../../containers/Partners/Detail';

export default {
  screen: PartnersDetail,
  navigationOptions: ({ navigation }) => ({
    title: navigation.getParam('partner').name
  }),
  headerLeft: undefined
};
