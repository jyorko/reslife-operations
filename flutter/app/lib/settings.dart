import 'package:flutter/material.dart';

class Settings extends StatelessWidget {
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
      body: ListView(
        children: [
          const SizedBox(height: 20),
          _buildProfileCard(context),
        ],
      ),
    );
  }

  Widget _buildProfileCard(BuildContext context) {
    const ImageProvider backgroundImage = AssetImage('assets/images/alt_image.png');

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: Card(
        child: ListTile(
          // Picture of the user
          leading: CircleAvatar(
            backgroundImage: backgroundImage,
          ),
          // Name of the user
          title: const Text(
            'Saori Kojima',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
            ),
          ),
          subtitle: Text(
            '(Sally) SMA',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w400,
            ),
          ),
          contentPadding: EdgeInsets.fromLTRB(20, 15, 20, 0),
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
