import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:app/main.dart';

/* 
  For debug
  1.Connect to VPN
  2.Correct password
  streifeasta@gmail.com
  $Delete_th1s_entry
 */

class Login extends StatefulWidget {
  const Login({Key? key}) : super(key: key);

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // message shown above login button
  String? errorMessage;

  // This function will handle the login process, and navigate to the home page if successful
  void _attemptLogin() async {
    final String username = _usernameController.text;
    final String password = _passwordController.text;

    // Check if username and password are provided
    if (username.isEmpty || password.isEmpty) {
      setState(() {
        errorMessage = 'Username and password are required.';
      });
      return;
    }

    // Perform authentication and get the cookie
    try {
      // Create Dio instance
      Dio dio = Dio();

      // Send a POST request to the authentication endpoint
      Response response = await dio.post(
        'http://10.60.170.18/api/proxy/auth/signin',
        data: {
          'email': username,
          'password': password,
        },
      );

      // Get the 'set-cookie' header from the response
      String? setCookieHeader = response.headers.map['set-cookie']?.first;
      print(response.headers);
      print(setCookieHeader);
      // Check if the authentication was successful
      if (response.statusCode == 200 && setCookieHeader != null) {
        // reset error message
        setState(() {
          errorMessage = null;
        });
        // Navigate to the home page if authentication is successful
        _navigateToHome();
      } else {
        // Handle authentication failure
        setState(() {
          errorMessage = 'Invalid username or password.';
        });
      }
    } catch (e) {
      // Handle any errors that occur during the authentication process
      setState(() {
        errorMessage = 'Error during login: $e';
      });
    }
  }

  // Navigate to the home page
  void _navigateToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const MainScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: GestureDetector(
        // hide keyboard when login is clicked
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextField(
                // username text field
                controller: _usernameController,
                decoration: const InputDecoration(
                  labelText: 'Username',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              TextField(
                // password text field
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                keyboardType: TextInputType.visiblePassword,
              ),
              // Error message field
              Text(
                errorMessage ??
                    '', // show error message if applicable or show blank
                style: const TextStyle(
                  color: Colors.red,
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _attemptLogin,
                child: const Text('Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
