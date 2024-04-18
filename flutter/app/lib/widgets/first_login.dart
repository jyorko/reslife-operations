import 'package:flutter/material.dart';
import 'package:app/network/dio_client.dart';

void FirstLogin(
  BuildContext context,
  String session,
  String email,
) {
  final TextEditingController newPasswordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();
  final DioClient dioClient =
      DioClient(); // Assuming this is how you instantiate your DioClient

  void handleSubmit() async {
    if (newPasswordController.text == confirmPasswordController.text) {
      try {
        final response = await dioClient.setFirstPassword(
          email,
          newPasswordController.text,
          session,
        );
        if (response.statusCode == 200) {
          // Handle success, e.g., close modal and show a success message
          Navigator.of(context).pop();
        } else {
          // see if there is a message in the response
          final message = response.data['message'] ?? 'An error occurred';
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text('Error'),
              content: Text(message),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('OK'),
                ),
              ],
            ),
          );
        }
      } catch (e) {
        // Handle network/error exceptions
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Error'),
            content: Text('An error occurred: $e'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('OK'),
              ),
            ],
          ),
        );
      }
    } else {
      // Handle passwords not matching
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Error'),
          content: const Text('Passwords do not match.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        ),
      );
    }
  }

  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (BuildContext context) {
      return DraggableScrollableSheet(
        initialChildSize: 0.9,
        maxChildSize: 1,
        builder: (_, ScrollController scrollController) {
          return Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            child: Column(
              children: [
                _buildHeader(context),
                Expanded(
                  child: ListView(
                    controller: scrollController,
                    padding: const EdgeInsets.all(16),
                    children: [
                      _buildEmailField(email),
                      const SizedBox(height: 16),
                      _buildPasswordField(newPasswordController, 'New Password',
                          'Enter your new password'),
                      const SizedBox(height: 16),
                      _buildPasswordField(confirmPasswordController,
                          'Confirm Password', 'Confirm your new password'),
                      const SizedBox(height: 24),
                      _buildSubmitButton(handleSubmit),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      );
    },
  );
}

Widget _buildHeader(BuildContext context) {
  return Padding(
    padding: const EdgeInsets.all(16.0),
    child: Row(
      children: [
        const Text(
          'Create New Password',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        Spacer(),
        IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ],
    ),
  );
}

Widget _buildEmailField(String email) {
  return TextField(
    controller: TextEditingController(text: email),
    decoration: const InputDecoration(
      labelText: 'Email',
      border: OutlineInputBorder(),
    ),
    readOnly: true,
  );
}

Widget _buildPasswordField(
    TextEditingController controller, String label, String hint) {
  return TextField(
    controller: controller,
    obscureText: true,
    decoration: InputDecoration(
      labelText: label,
      hintText: hint,
      border: const OutlineInputBorder(),
    ),
  );
}

Widget _buildSubmitButton(VoidCallback onPressed) {
  return ElevatedButton(
    onPressed: onPressed,
    child: const Text('Submit'),
    style: ElevatedButton.styleFrom(
      minimumSize: const Size.fromHeight(50),
    ),
  );
}
