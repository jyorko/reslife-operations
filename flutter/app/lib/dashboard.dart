import 'package:flutter/material.dart';
import 'package:app/task_card.dart';
import 'package:app/data/task_data.dart';

class Dashboard extends StatelessWidget {
  final TaskData taskData = TaskData();
  final shiftStatus = 'On Shift';

  @override
  Widget build(BuildContext context) {
    final tasks = taskData.getOngoingTasks();

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

            // Task Cards
            for (var task in tasks)
              Column(
                children: [
                  TaskCard(
                    taskId: task.taskId,
                    title: task.title,
                    dueDate: task.dueDate,
                    tags: task.tags,
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 15),
                    child: Row(
                      children: <Widget>[
                        const Icon(Icons.image),
                        const Icon(Icons.image),
                        const Spacer(),
                        Text('${task.comments?.length ?? 0} comments'),
                      ],
                    ),
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
            for (var task in tasks)
              Column(
                children: [
                  TaskCard(
                    taskId: task.taskId,
                    title: task.title,
                    dueDate: task.dueDate,
                    tags: task.tags,
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 15),
                    child: Row(
                      children: <Widget>[
                        const Icon(Icons.image),
                        const Icon(Icons.image),
                        const Spacer(),
                        Text('${task.comments?.length ?? 0} comments'),
                      ],
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
