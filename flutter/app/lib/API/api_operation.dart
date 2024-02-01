import 'dart:convert';
import 'package:http/http.dart' as http;

// fetch user info
Future<Map<String, dynamic>> fetchData() async {
  final response = await http
      .get(Uri.parse("https://reslife-operations.vercel.app/api/proxy/"));
  if (response.statusCode == 200) {
    return json.decode(response.body);
  } else {
    throw Exception('Failed to load data');
  }
}
