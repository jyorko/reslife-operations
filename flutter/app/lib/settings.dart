import 'package:flutter/material.dart';
import 'package:app/API/api_operation.dart';

class Settings extends StatelessWidget {
  const Settings({super.key});

  // final String firstName;
  // final String lastName;
  // final String preferredName;
  // final String position;

  // const Settings({
  //   Key? key,
  //   required this.firstName,
  //   required this.lastName,
  //   required this.preferredName,
  //   required this.position,
  // }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: FutureBuilder(
        future: fetchData(), // call API
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          } else {
            return ListView(
              children: [
                const SizedBox(height: 20),
                if (snapshot.data != null)
                  _buildProfileCard(context, snapshot.data),
              ],
            );
          }
        },
      ),
    );
  }

  Widget _buildProfileCard(
      BuildContext context, Map<String, dynamic>? userData) {
    const ImageProvider backgroundImage =
        AssetImage('assets/images/alt_image.png');

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: Card(
        child: ListTile(
          // Picture of the user
          leading: const CircleAvatar(
            backgroundImage: backgroundImage,
          ),
          // Name of the user
          // * Currently it is showing fixed user which is "Sergey Kopanytsia"
          // * Needs to be modified to its correspond ID based on login info
          // - Sally
          title: Text(
            '${userData?["results"][0]["firstName"]} ${userData?["results"][0]["lastName"]}',
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
            ),
          ),
          subtitle: Text(
            '${userData?["results"][0]["role"]}',
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
  }
}
