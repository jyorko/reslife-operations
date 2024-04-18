import 'package:flutter/material.dart';
import 'package:app/network/dio_client.dart';
import 'package:app/main.dart';
import 'package:dio/dio.dart';

class Settings extends StatelessWidget {
  final DioClient dioClient;

  Settings({Key? key, DioClient? client})
      : dioClient = client ?? DioClient(),
        super(key: key);

  void _logout(BuildContext context) {
    dioClient.logout();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const MyApp()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          FutureBuilder(
            future: dioClient.fetchStudentStaff(selfOnly: true),
            builder: (context, AsyncSnapshot<Response<dynamic>> snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(child: Text(snapshot.error.toString()));
              } else {
                final response = snapshot.data?.data;
                if (response is Map && response.containsKey('message')) {
                  return Center(child: Text(response['message']));
                }
                if (response is Map && response.containsKey('results')) {
                  final results = response['results'];
                  if (results is List && results.isNotEmpty) {
                    return _buildProfileCard(context, results[0]);
                  }
                }
                return Center(child: Text('No user information found'));
              }
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20.0),
            child: ElevatedButton(
              onPressed: () => _logout(context),
              child: const Text('Logout', style: TextStyle(fontSize: 18)),
              style: ElevatedButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 100, vertical: 15),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileCard(
      BuildContext context, Map<String, dynamic> userData) {
    const ImageProvider backgroundImage =
        AssetImage('assets/images/alt_image.png');

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: Card(
        child: ListTile(
          leading: const CircleAvatar(backgroundImage: backgroundImage),
          title: Text(
            '${userData["fullName"]}',
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Email: ${userData["email"]}'),
              Text('Phone: ${userData["phone"]}'),
              Text('Role: ${userData["role"]}'),
              Text('Gender: ${userData["gender"]}'),
            ],
          ),
          contentPadding: const EdgeInsets.fromLTRB(20, 15, 20, 0),
          isThreeLine: true,
          trailing: IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              /* Navigate to the edit profile page code goes here */
            },
          ),
        ),
      ),
    );
  }
}
