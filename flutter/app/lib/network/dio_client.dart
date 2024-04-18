import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';

class DioClient {
  static final DioClient _singleton = DioClient._internal();
  final Dio _dio;

  factory DioClient({String baseUrl = 'http://10.60.170.18'}) {
    return _singleton;
  }

  DioClient._internal({String baseUrl = 'http://10.60.170.18'})
      : _dio = Dio(BaseOptions(baseUrl: baseUrl)) {
    _dio.interceptors.add(CookieManager(CookieJar()));
    _dio.options.validateStatus = (status) => status! <= 500;
  }

  Future<Response> login(String username, String password) async {
    return _performPost(
        '/api/v1/auth/signin', {'email': username, 'password': password});
  }

  Future<Response> setFirstPassword(
      String email, String password, String session) async {
    return _performPost('/api/v1/auth/set-first-password',
        {'email': email, 'password': password, 'session': session});
  }

  Future<Response> fetchData(String path) async {
    return await _dio.get(path);
  }

  Future<Response> _performPost(String path, Map<String, dynamic> data) async {
    return await _dio.post(path, data: data);
  }

  void logout() {
    _dio.interceptors.add(InterceptorsWrapper(onRequest: (options, handler) {
      options.headers['Auth'] = '';
      handler.next(options);
    }));
  }
}
