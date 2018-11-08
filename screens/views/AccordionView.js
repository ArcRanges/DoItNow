import React from 'react';

import {
  View,
  Text,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  StyleSheet
} from 'react-native';

import Accordion from 'react-native-collapsible/Accordion';

export default class AccordionView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sections: props.entries || [],
      activeSections: [],
      refreshing: false,
    }
  }

  componentWillMount() {

    this.props.loadEntries();
  }



  _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
        <Text>{section.location}</Text>
      </View>
    );
  };

  _renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.location}</Text>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text>Due: {section.date}</Text>
        <Text>Notes: {section.description}</Text>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.loadEntries}
          />
          }
        >
        <Accordion
          sections={this.props.entries}
          activeSections={this.state.activeSections}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
        />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({

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
});
