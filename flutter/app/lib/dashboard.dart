import 'package:app/data/fetch_task_data.dart';
import 'package:flutter/material.dart';
import 'package:app/widgets/task_card.dart';
import 'package:app/data/mock_data/task_mock_data.dart';

class Dashboard extends StatelessWidget {
  Dashboard({super.key});

  // TODO: replace task provider to API
  TasksDataProvider tasksProvider = TasksDataProvider(tasks: taskMockData);

  // final TaskData taskData = TaskData();
  final shiftStatus = 'On Shift';

  @override
  Widget build(BuildContext context) {
    // Task lists filterd by their status
    List<Map<String, dynamic>> onGoingTasks =
        tasksProvider.getFilteredTasks("On-Going");
    List<Map<String, dynamic>> completedTasks =
        tasksProvider.getFilteredTasks("Complete");
    List<Map<String, dynamic>> onHoldTasks =
        tasksProvider.getFilteredTasks("On-Hold");

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            // user shift status
            Center(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 15, 20, 10),
                child: Text(
                  'You are currently $shiftStatus',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ),
            ),

            // On Going tasks
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 15, 20, 10),
              child: Text(
                'Tasks you are working on',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            // User On Going Task Cards
            for (var task in onGoingTasks)
              Column(
                children: [
                  TaskCard(
                    taskId: task['id'],
                    title: task['title'],
                    dueDate: task['dueDate'],
                    tag: task['tag'],
                    comments: List<String>.from(task['comments']),
                  ),
                ],
              ),

            const Divider(height: 20, thickness: 1, indent: 20, endIndent: 20),

            // New Tasks related to the user's position
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 15, 20, 10),
              child: Text(
                'Tasks related to your position',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            // Task Cards
            for (var task in onHoldTasks)
              Column(
                children: [
                  TaskCard(
                    taskId: task['id'],
                    title: task['title'],
                    dueDate: task['dueDate'],
                    tag: task['tag'],
                    comments: List<String>.from(task['comments']),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
