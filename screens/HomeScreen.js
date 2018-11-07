import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import { WebBrowser } from 'expo';

import { Header, Icon, Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';

import { MonoText } from '../components/StyledText';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SECTIONS = [
  {
    title: 'Home',
    content: 'Finish cleaning the kitchen'
  },
  {
    title: 'Work',
    content: 'Finish Welcome page'
  }
];

class AccordionView extends React.Component {
  state = {
    activeSections: []
  };

  _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <Accordion
        sections={SECTIONS}
        activeSections={this.state.activeSections}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />
    );
  }
}
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      modalVisible: true,
      error: ['','','','']
    }

    this.addNewEntry = this.addNewEntry.bind(this);
  }

  addNewEntry() {
    // Alert.alert('Adding a new entre');
    // console.log('entra');
    this.setState({
      modalVisible: true,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{ text: 'UPCOMING', style: { color: '#fff', fontSize: 20 } }}
          rightComponent={<Icon
                            name="plus"
                            color="white"
                            size={18}
                            type="font-awesome"
                            onPress={() => this.addNewEntry()} />}
        />

        <AccordionView/>

        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={()=> this.setState({modalVisible: !this.state.modalVisible})}
          >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add Entry
              </Text>
            </View>
            <View style={styles.modalContent}>
              <FormLabel>Date</FormLabel>
              <FormInput inputStyle={styles.inputStyle} onChangeText={()=> console.log('changed')}/>
              <FormValidationMessage>{this.state.error[0]}</FormValidationMessage>
              <FormLabel>Title</FormLabel>
              <FormInput inputStyle={styles.inputStyle} onChangeText={()=> console.log('changed')}/>
              <FormValidationMessage>{this.state.error[1]}</FormValidationMessage>
              <FormLabel>Location</FormLabel>
              <FormInput inputStyle={styles.inputStyle} onChangeText={()=> console.log('changed')}/>
              <FormValidationMessage>{this.state.error[2]}</FormValidationMessage>
              <FormLabel>Description</FormLabel>
              <FormInput inputStyle={styles.inputStyle} onChangeText={()=> console.log('changed')}/>
              <FormValidationMessage>{this.state.error[3]}</FormValidationMessage>
            </View>
            <View style={styles.modalFooter}>
              <Button
                raised
                backgroundColor="rgb(90, 200, 250)"
                icon={{name: 'save', type:'font-awesome', buttonStyle: styles.submitButtonStyle}}
                title='SUBMIT'
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
   backgroundColor: '#F5FCFF',
   padding: 10,
  },
  headerText: {
   textAlign: 'left',
   fontSize: 16,
   fontWeight: '500',
  },
  content: {
   padding: 20,
   backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalHeader: {
    flex: 1,
    maxHeight: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(0,122,255)',
  },
  modalTitle: {
    color: 'white',
    fontSize: 24
  },
  modalContent: {
    flex: 4,
    alignItems: 'center'
  },
  modalFooter: {
    flex: 1,
    alignItems: 'flex-end'
  },
  inputStyle: {
    maxWidth: 225,
  }
});
