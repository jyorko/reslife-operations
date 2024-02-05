import 'package:flutter/material.dart';
import 'package:app/widgets/task_card.dart';
import 'package:app/data/task_data.dart';

class Dashboard extends StatelessWidget {
  Dashboard({super.key});

  final TaskData taskData = TaskData();
  final shiftStatus = 'On Shift';

  @override
  Widget build(BuildContext context) {
    final ongoingTasks = taskData.getOngoingTasks();
    final inProgressTasks = taskData.getOngoingTasks();

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

            // using json data

            // User On Going Task Cards
            for (var task in ongoingTasks)
              Column(
                children: [
                  TaskCard(
                    taskId: task.taskId,
                    title: task.title,
                    dueDate: task.dueDate,
                    tags: task.tags,
                    comments: task.comments,
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
            for (var task in inProgressTasks)
              Column(
                children: [
                  TaskCard(
                    taskId: task.taskId,
                    title: task.title,
                    dueDate: task.dueDate,
                    tags: task.tags,
                    comments: task.comments,
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
