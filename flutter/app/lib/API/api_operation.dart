import 'dart:convert';
import 'package:http/http.dart' as http;

// fetch user info
Future<Map<String, dynamic>> fetchData() async {
  final response = await http
      .get(Uri.parse("http://10.60.170.18/api/v1/student_staff?page=1"));
  if (response.statusCode == 200) {
    return json.decode(response.body);
  } else {
    throw Exception('Failed to load data');
  }
}
