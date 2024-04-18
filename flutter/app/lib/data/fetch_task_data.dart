import 'package:app/network/dio_client.dart';
import 'package:dio/dio.dart';

class TasksDataProvider {
  final List<Map<String, dynamic>> _tasks;
  final DioClient _dioClient;

  TasksDataProvider({
    required List<Map<String, dynamic>> tasks,
    required DioClient dioClient,
  })  : _tasks = tasks,
        _dioClient = dioClient;

  List<Map<String, dynamic>> get allTasks => _tasks;

  List<Map<String, dynamic>> getFilteredTasks(String status,
      [List<String>? assignedTo]) {
    return _tasks.where((task) {
      bool statusMatches = task['status'] == status;
      bool assignedMatches = assignedTo == null ||
          assignedTo.any((name) => task['assignedTo'].contains(name));
      return statusMatches && assignedMatches;
    }).toList();
  }

  /// Asynchronously provides the details of a task by its unique identifier.
  /// First checks mock data, then tries API if not found.
  Future<Map<String, dynamic>> getTaskById(String id) async {
    try {
      // Check if the task exists in mock data
      var task = _tasks.firstWhere((task) => task['id'] == id,
          orElse: () =>
              throw StateError('Task with ID $id not found in mock data'));
      return task;
    } catch (e) {
      if (e is StateError) {
        print(e);
      }

      // Fetch from API if not found in mock data
      Response response = await _dioClient.fetchTasks(taskID: id);
      if (response.data['results'].isNotEmpty) {
        return response.data['results'][0];
      } else {
        throw StateError('Task with ID $id not found');
      }
    }
  }
}
