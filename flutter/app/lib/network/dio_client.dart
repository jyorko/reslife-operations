import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';

class DioClient {
  static final DioClient _singleton = DioClient._internal();
  final Dio _dio;

  factory DioClient({String baseUrl = 'http://localhost:5000/'}) {
    return _singleton;
  }

  DioClient._internal({String baseUrl = 'http://localhost:5000/'})
      : _dio = Dio(BaseOptions(baseUrl: baseUrl)) {
    _dio.interceptors.add(CookieManager(CookieJar()));
    _dio.options.validateStatus = (status) => status! <= 500;
  }

  Future<Response> login(String username, String password) async {
    return _performPost(
        '/auth/signin', {'email': username, 'password': password});
  }

  //     this.router.get("/student_staff", this.validateRequest("student_staff"), this.fetchStudentStaff);
  // }

  // async fetchStudentStaff(req: Request, res: Response) {
  //   try {
  //     const page = parseInt(req.query.page as string);
  //     const studentStaffOnly = req.query.studentStaffOnly === "true";
  //     const selfOnly = req.query.selfOnly === "true";
  //     const { name, gender, phone } = req.query;

  Future<Response> fetchStudentStaff(
      {int page = 1,
      bool studentStaffOnly = false,
      bool selfOnly = false,
      String name = '',
      String gender = '',
      String phone = ''}) async {
    return _performGet(
        '/student_staff?page=$page&studentStaffOnly=$studentStaffOnly&selfOnly=$selfOnly&name=$name&gender=$gender&phone=$phone');
  }

  Future<Response> fetchTasks(
      {String taskID = '',
      int page = 1,
      bool ownOnly = false,
      String userID = '',
      String periodFrom = '',
      String periodTo = '',
      String status = '',
      String location = ''}) async {
    return _performGet(
        '/tasks?taskID=$taskID&page=$page&ownOnly=$ownOnly&status=$status&location=$location');
  }

  Future<Response> setFirstPassword(
      String email, String password, String session) async {
    return _performPost('/auth/set-first-password',
        {'email': email, 'password': password, 'session': session});
  }

  Future<Response> _performPost(String path, Map<String, dynamic> data) async {
    return await _dio.post(path, data: data);
  }

  Future<Response> _performGet(String path) async {
    return await _dio.get(path);
  }

  void logout() {
    _dio.interceptors.add(InterceptorsWrapper(onRequest: (options, handler) {
      options.headers['Auth'] = '';
      handler.next(options);
    }));
  }
}
