import 'package:app/data/mock_data/task_mock.dart';

class TaskData {
  List<Task> _allTasks = [];

  TaskData() {
    _allTasks = generateMockTasks(15);
  }

  List<Task> getOngoingTasks() {
    return _allTasks.where((task) => task.status == 'Open' || task.status == 'In Progress').toList();
  }

  List<Task> getInProgressTasks() {
    return _allTasks.where((task) => task.status == 'In Progress').toList();
  }

  List<Task> getCompletedTasks() {
    return _allTasks.where((task) => task.status == 'Completed').toList();
  }
}