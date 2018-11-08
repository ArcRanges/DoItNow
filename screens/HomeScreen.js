import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  ListView,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  TouchableHighlight,
  Dimensions,

} from 'react-native';

import { WebBrowser } from 'expo';

import { Header, Icon, Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

import Modal from 'react-native-modal';
import AccordionView from './views/AccordionView';

import { MonoText } from '../components/StyledText';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    // AsyncStorage.clear();
    this.loadEntries();
  }

  componentDidMount() {
    this._updateCurrentID();
  }

  _updateCurrentID = async () => {
    await AsyncStorage.getItem('entries').then((data) => {

      if (data && data.length > 0) {
        const DATA = JSON.parse(data);
        this.setState({
          curr_id: DATA[DATA.length - 1].id,
        });
      }

    }).catch((err) => {
      console.log(err);
    });
  }

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      modalVisible: false,
      curr_id: 0,

      entries: [],
      error: ['','','',''],
      isDateTimePickerVisible: false,

      pickedDate: '',
      converted_date: '',
      title: '',
      location: '',
      description: '',

      refreshing: false,

      listType: 'FlatList',
			listViewData: Array(20).fill('').map((_,i) => ({key: `${i}`, text: `item #${i}`})),
			sectionListData: Array(5).fill('').map((_,i) => ({title: `title${i + 1}`, data: [...Array(5).fill('').map((_, j) => ({key: `${i}.${j}`, text: `item #${j}`}))]})),
    }

    this.addNewEntry = this.addNewEntry.bind(this);
  }

  closeRow(rowMap, rowKey) {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	}

	deleteRow(rowMap, rowKey) {
		this.closeRow(rowMap, rowKey);
		const newData = [...this.state.listViewData];
		const prevIndex = this.state.listViewData.findIndex(item => item.key === rowKey);
		newData.splice(prevIndex, 1);
		this.setState({listViewData: newData});
	}

	deleteSectionRow(rowMap, rowKey) {
		this.closeRow(rowMap, rowKey);
		var [section, row] = rowKey.split('.');
		const newData = [...this.state.sectionListData];
		const prevIndex = this.state.sectionListData[section].data.findIndex(item => item.key === rowKey);
		newData[section].data.splice(prevIndex, 1);
		this.setState({sectionListData: newData});
	}

	onRowDidOpen = (rowKey, rowMap) => {
		console.log('This row opened', rowKey);
		setTimeout(() => {
			this.closeRow(rowMap, rowKey);
		}, 2000);
	}

  addNewEntry() {
    this.setState({
      modalVisible: true,
      refreshing: true,
    });
  }

  _deleteEntry = async (id) => {
    console.log('id selected: ' + id);
    // get entries
    // parse to JSON
    // splice it
    const currentEntries = await AsyncStorage.getItem('entries');

    let newEntries = JSON.parse(currentEntries);

    if ( !newEntries ) {
      newEntries = [];
    }

    var index;

    for (let i = 0; i < newEntries.length; i++) {
      if (newEntries[i].id == id) {
        console.log('found entry :  ' + id);
        index = i;
      }
    }

    newEntries.splice(index, 1);

    if (newEntries.length > 0) {
      await AsyncStorage.setItem('entries', JSON.stringify(newEntries)).then(()=> {
        console.log('deleted item id ' + id);
        this.loadEntries();
        this._updateCurrentID();
      }).catch((err) => {
        console.log(err);
      });
    } else {
      AsyncStorage.clear(); //
      this.loadEntries();
    }

  }

  _saveEntry = async () => {
    this.setState({
      refreshing: true
    });

    const entry = {
      'id': this.state.curr_id,
      'date': this.state.pickedDate,
      'date_created': Date.now(),
      'title:': this.state.title,
      'location': this.state.location,
      'description': this.state.description
    }

    const currentEntries = await AsyncStorage.getItem('entries');

    let newEntries = JSON.parse(currentEntries);

    if ( !newEntries ) {
      newEntries = [];
    }

    // console.log(newEntries);

    newEntries.push(entry);

    await AsyncStorage.setItem('entries', JSON.stringify(newEntries)).then(()=> {
      console.log('Successfully saved entry');

      this.setState({
        curr_id: this.state.curr_id + 1,
        pickedDate: '',
        title: '',
        description: '',
        location: '',
        converted_date: '',
        modalVisible: false,
        refreshing: false,
      });
      this.loadEntries();
    }).catch(()=> {
      console.log('There was an error saving the entry');
    });
  }

  loadEntries = async () => {

    await AsyncStorage.getItem('entries').then((data) => {
      // console.log(JSON.parse(data));

      if (data && data.length > 0) {
        let pdata = JSON.parse(data);
        console.log(pdata[pdata.length-1].id);
        this.setState({
          entries: pdata,
        });
      } else {
        this.setState({
          entries: []
        });
      }

    }).catch((err) => {
      console.log('error loading entries ' + err);
    });
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this._hideDateTimePicker();

    // convert date to readable format
    let c_date = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(date);

    this.setState({
      converted_date: c_date,
      pickedDate: date
    });

  };

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

        {/* <AccordionView
          refreshing={this.state.refreshing}
          loadEntries={this.loadEntries}
          entries={this.state.entries}
        /> */}

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.state.loadEntries}
            />
          }
        >
        { this.state.entries.map((entry) => {
          return (
            <View key={entry.date_created} style={styles.standalone}>
    					<SwipeRow
    						leftOpenValue={75}
    						rightOpenValue={-75}
    					>
    						<View style={styles.standaloneRowBack}>
    							<Text style={styles.backTextWhite}>Left</Text>
                  <TouchableOpacity onPress={()=> this._deleteEntry(entry.id.toString())}>
                    <Text style={styles.backTextWhite}>Remove</Text>
                  </TouchableOpacity>

    						</View>
    						<View style={styles.standaloneRowFront}>
    							<Text>{entry.id} {entry.location}</Text>
    						</View>
    					</SwipeRow>
    				</View>
          )
        })
      }
      </ScrollView>




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
              <FormInput
                inputStyle={styles.inputStyle}
                onFocus={this._showDateTimePicker}
                placeholder={this.state.converted_date}/>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
              />
              <FormValidationMessage>{this.state.error[0]}</FormValidationMessage>
              {/* <FormLabel>Title</FormLabel>
              <FormInput inputStyle={styles.inputStyle} onChangeText={(input)=> this.setState({title: input})}/>
              <FormValidationMessage>{this.state.error[1]}</FormValidationMessage> */}
              <FormLabel>Location</FormLabel>
              <FormInput inputStyle={styles.inputStyle} onChangeText={(input)=> this.setState({location: input})}/>
              <FormValidationMessage>{this.state.error[2]}</FormValidationMessage>
              <FormLabel>Description</FormLabel>
              <FormInput inputStyle={styles.inputStyle} onChangeText={(input)=> this.setState({description: input})}/>
              <FormValidationMessage>{this.state.error[3]}</FormValidationMessage>
            </View>
            <View style={styles.modalFooter}>
              <Button
                raised
                backgroundColor="rgb(90, 200, 250)"
                icon={{name: 'save', type:'font-awesome', buttonStyle: styles.submitButtonStyle}}
                title='SUBMIT'
                onPress={this._saveEntry}
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
  standalone: {
    marginBottom: 2,
	},
	standaloneRowFront: {
		alignItems: 'center',
		backgroundColor: '#CCC',
		justifyContent: 'center',
		height: 50,
	},
	standaloneRowBack: {
		alignItems: 'center',
		backgroundColor: '#8BC645',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15
	},
	backTextWhite: {
		color: '#FFF'
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
