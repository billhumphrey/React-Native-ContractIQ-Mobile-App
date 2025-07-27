import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Card } from 'react-native-paper';

type Clause = {
  title: string;
  explanation: string;
  risk: 'Low' | 'Medium' | 'High';
};

type ParamList = {
  ResultScreen: {
    summary: {
      clauses: Clause[];
    };
  };
};

const ResultScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'ResultScreen'>>();
  const { summary } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Contract Analysis Summary</Text>

      {summary?.clauses?.length ? (
        summary.clauses.map((clause, index) => (
          <Card key={index} style={[styles.card, getRiskStyle(clause.risk)]}>
            <Card.Content>
              <Text style={styles.title}>{clause.title}</Text>
              <Text style={styles.body}>{clause.explanation}</Text>
              <Text style={styles.risk}>Risk: {clause.risk}</Text>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text style={styles.noData}>No clauses found.</Text>
      )}
    </ScrollView>
  );
};

const getRiskStyle = (risk: string) => {
  switch (risk) {
    case 'High':
      return { borderLeftColor: 'red', borderLeftWidth: 5 };
    case 'Medium':
      return { borderLeftColor: 'orange', borderLeftWidth: 5 };
    case 'Low':
      return { borderLeftColor: 'green', borderLeftWidth: 5 };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  body: {
    fontSize: 14,
    marginBottom: 5,
  },
  risk: {
    fontWeight: '600',
    color: '#555',
  },
  noData: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ResultScreen;
