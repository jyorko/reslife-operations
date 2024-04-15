import 'package:flutter/material.dart';
import 'package:app/network/dio_client.dart';
import 'package:app/main.dart';

class Settings extends StatelessWidget {
  final DioClient dioClient;

  Settings({Key? key, DioClient? client})
      : dioClient = client ?? DioClient(),
        super(key: key);

  // function handles the logout process
  void _logout(BuildContext context) {
    DioClient().logout();
    // Navigate to the login page
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
            future: dioClient.fetchData("/api/v1/student_staff?page=1"),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const CircularProgressIndicator();
              } else if (snapshot.hasError) {
                return Text('Error: ${snapshot.error}');
              } else {
                Map<String, dynamic>? userData = snapshot.data?.data;
                return _buildProfileCard(context, userData);
              }
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20.0),
            child: ElevatedButton(
              onPressed: () => _logout(context),
              child: const Text(
                'Logout',
                style: TextStyle(
                  fontSize: 18,
                ),
              ),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 100, vertical: 15),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileCard(
      BuildContext context, Map<String, dynamic>? userData) {
    const ImageProvider backgroundImage =
        AssetImage('assets/images/alt_image.png');

    if (userData != null &&
        userData.containsKey('results') &&
        (userData['results'] as List).isNotEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Card(
          child: ListTile(
            leading: const CircleAvatar(
              backgroundImage: backgroundImage,
            ),
            title: Text(
              '${userData["results"]![0]["fullName"]}',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
            subtitle: Text(
              '${userData["results"]![0]["role"]}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w400,
              ),
            ),
            contentPadding: const EdgeInsets.fromLTRB(20, 15, 20, 0),
            isThreeLine: true,
            trailing: IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                // Navigate to edit profile page
              },
            ),
          ),
        ),
      );
    } else {
      return const SizedBox(); // or an appropriate error message
    }
  }
}
