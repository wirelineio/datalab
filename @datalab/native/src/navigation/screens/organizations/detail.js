import OrganizationsDetail from '../../../containers/Organizations/Detail';

export default {
  screen: OrganizationsDetail,
  navigationOptions: ({ navigation }) => ({
    title: `Organization: ${navigation.getParam('organization').name}`
  }),
  headerLeft: undefined
};
