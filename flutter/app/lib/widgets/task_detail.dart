import 'package:flutter/material.dart';

class TaskDetail extends StatelessWidget {
  final String taskId;

  final String taskTitle = 'task_title';
  final String taskLocation = 'task_location';
  final String taskDueDate = 'task_due_date';
  final String taskDescription =
      'task_description brah brah yada yada wowwow brah brah yada yada wowwow brah brah yada yada ...';
  final List<String> assignedTo = [
    'assignedTo[0]',
    'assignedTo[1]',
    'assignedTo[2]'
  ];

  TaskDetail({
    Key? key,
    required this.taskId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Task Detail'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(0, 20, 0, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              // Task ID
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
                child: Text(
                  'Task ID: $taskId',
                ),
              ),
              // Task title
              const Padding(
                padding: EdgeInsets.fromLTRB(20, 5, 20, 10),
                child: Text(
                  'task_title',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  // Left side
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Task location
                      const Padding(
                        padding: EdgeInsets.fromLTRB(0, 0, 0, 5),
                        child: Text(
                          'Location',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: Colors.black54,
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 0, 0, 5),
                        child: Text(
                          taskLocation,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Colors.black,
                          ),
                        ),
                      ),
                      // Task due date
                      const Padding(
                        padding: EdgeInsets.fromLTRB(0, 5, 0, 5),
                        child: Text(
                          'Due Date',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: Colors.black54,
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 0, 0, 5),
                        child: Text(
                          taskDueDate,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ],
                  ),
                  // Right side: Members
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Assigned to',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              // Task description
              const Padding(
                padding: EdgeInsets.fromLTRB(20, 20, 20, 5),
                child: Text(
                  'Description',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.black54,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(25, 5, 25, 10),
                child: Text(
                  taskDescription,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              // TODO: Add comment feature
            ],
          ),
        ),
      ),
    );
  }
}
