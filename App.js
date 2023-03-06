import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('productsdb.db');

export default function App() {

  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');
  const [products, setProducts] = useState([]);

  // creating database with useEffect hook
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists product (id integer primary key autoincrement, productNames text, amount text);');
    }, null, updateList); 
  }, []);

  // Save product
  const saveProduct = () => {
    db.transaction(tx => {
        tx.executeSql('insert into product (productNames, amount) values (?, ?);', [productName, amount]);    
      }, null, updateList
    )
  }

  // Update productlist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from product;', [], (_, { rows }) =>
        setProducts(rows._array),
      ); 
    });
  }

  // Delete product
  const deleteProduct = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from product where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.textinput1}
        placeholder='Product' 
        onChangeText={(productName) => setProductName(productName)}
        value={productName}
      />  
      <TextInput 
        style={styles.textinput2}
        placeholder='Amount' 
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />      
      <Button onPress={saveProduct} title="Save" /> 
      <Text style={styles.shoppinglistheader}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
          <View style={styles.listcontainer}>
            <Text 
              style={{fontSize: 18}}>{item.productNames}, {item.amount}
            </Text>
            <Text style={{fontSize: 18, color: 'red'}} onPress={() => deleteProduct(item.id)}> Bought</Text>
          </View>
        } 
        data={products} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },

  textinput1: {
    marginTop: 50, 
    fontSize: 18, 
    width: 200, 
    borderColor: 'gray', 
    borderWidth: 1, 
    height: 30,
  },

  textinput2: { 
    marginTop: 5, 
    marginBottom: 5,  
    fontSize:18, 
    width: 200, 
    borderColor: 'gray', 
    borderWidth: 1, 
    height: 30,
  },

  shoppinglistheader: {
    marginTop: 20,
    marginBottom:15, 
    fontSize: 20
  },

});