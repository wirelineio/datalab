import ContactsDetail from '../../../containers/Contacts/Detail';

export default {
  screen: ContactsDetail,
  navigationOptions: ({ navigation }) => ({
    title: `Contact: ${navigation.getParam('contact').name}`
  }),
  headerLeft: undefined
};
