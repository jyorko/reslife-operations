import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:app/data/mock_data/mock_task_model.dart';

class FetchMockData {
  // fetch all tasks
  Future<List<Task>> fetchAllTasks() async {
    final jsonString = await rootBundle.loadString('data/mock_data/tasks.json');
    final jsonResponse = json.decode(jsonString) as List;
    return jsonResponse.map((taskJson) => Task.fromJson(taskJson)).toList();
  }

  // fetch all completed tasks
  Future<List<Task>> fetchCompletedTasks() async {
    final allTasks = await fetchAllTasks();
    return allTasks.where((task) => task.status == 'Complete').toList();
  }

  // fetch all On-Hold tasks
  Future<List<Task>> fetchOnHoldTasks() async {
    final allTasks = await fetchAllTasks();
    return allTasks.where((task) => task.status == 'On-Hold').toList();
  }

  // fetch all On-Going tasks
  Future<List<Task>> fetchOnGoingTasks() async {
    final allTasks = await fetchAllTasks();
    return allTasks.where((task) => task.status == 'On-Going').toList();
  }

  // fetch all tasks that user assigned
  Future<List<Task>> fetchUserOnGoingTasks(String userName) async {
    final onGoingTasks = await fetchOnGoingTasks();
    return onGoingTasks
        .where((task) => task.assignedTo.contains(userName))
        .toList();
  }

  Future<void> printUserOnGoingTasks(String userName) async {
  // Assuming fetchTasks is a function that returns Future<List<Task>>
  List<Task> tasks = await fetchUserOnGoingTasks(userName);
  for (Task task in tasks) {
    print(task.title); // Or do whatever you need with the task
  }
}
}
