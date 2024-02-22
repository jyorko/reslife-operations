import 'package:flutter/material.dart';
import 'package:app/API/api_operation.dart';

class Settings extends StatelessWidget {
  const Settings({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      // Set up API
      body: FutureBuilder(
          future: fetchData(
              "http://10.60.170.18/api/v1/student_staff?page=1"), // call API
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const CircularProgressIndicator();
            } else if (snapshot.hasError) {
              return Text('Error: ${snapshot.error}');
            } else {
              // Access the data using snapshot.data
              Map<String, dynamic>? userData = snapshot.data;
              return _buildProfileCard(context, userData); // Build Profile card
            }
          }),
    );
  }

  Widget _buildProfileCard(
      BuildContext context, Map<String, dynamic>? userData) {
    const ImageProvider backgroundImage = AssetImage('assets/images/alt_image.png'); // *enable customize later

    // Check if userData is not null and contains 'results' key with a non-empty list
    if (userData != null &&
        userData.containsKey('results') &&
        (userData['results'] as List).isNotEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Card(
          child: ListTile(
            // Picture of the user
            leading: const CircleAvatar(
              backgroundImage: backgroundImage,
            ),
            // Name of the user
            // Currently Fixed to index 0 "Jane Doe"
            title: Text(
              '${userData["results"]![0]["fullName"]}',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
            // Role of the user
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
      // Handle the case when userData is null or 'results' is empty
      return const SizedBox(); // or show a placeholder widget or an error message
    }
  }
}
