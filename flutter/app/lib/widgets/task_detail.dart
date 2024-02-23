import 'package:flutter/material.dart';
import 'package:app/data/fetch_task_data.dart';
import 'package:app/data/mock_data/task_mock_data.dart';
import 'package:app/style/text_style.dart';

class TaskDetail extends StatelessWidget {
  // text style variables
  final AppTextStyles textStyle = AppTextStyles();

  final String taskId;
  TasksDataProvider tasksProvider = TasksDataProvider(tasks: taskMockData);

  TaskDetail({
    Key? key,
    required this.taskId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Get the specific task details from the provider based on its ID
    Map<String, dynamic> taskDetails = tasksProvider.getTaskById(taskId);

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
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 5, 20, 10),
                child: Text(
                  taskDetails['title'],
                  style: AppTextStyles.detailTitle,
                ),
              ),
              // show its status and tag separating with /
              Row(
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 0, 10),
                    child: Text(
                      taskDetails['status'],
                      style: AppTextStyles.coloredText(taskDetails['status']),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                    child: Text(
                      ' / ${taskDetails['tag']}',
                      style: AppTextStyles.detailItemTitle,
                    ),
                  ),
                ],
              ),

              // Leading content
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  // Left side: Location, Due date
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Task location
                      const Padding(
                        padding: EdgeInsets.fromLTRB(0, 0, 0, 5),
                        child: Text(
                          'Location',
                          style: AppTextStyles.detailHeading,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 0, 0, 5),
                        child: Text(
                          taskDetails['location'],
                          style: AppTextStyles.detailItemTitle,
                        ),
                      ),
                      // Task due date
                      const Padding(
                        padding: EdgeInsets.fromLTRB(0, 5, 0, 5),
                        child: Text(
                          'Due Date',
                          style: AppTextStyles.detailHeading,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 0, 0, 5),
                        child: Text(
                          taskDetails['dueDate'],
                          style: AppTextStyles.detailItemTitle,
                        ),
                      ),
                    ],
                  ),

                  // Right side: Tools
                  // To wrap longer text, we use a SizedBox to provide some right margin.
                  SizedBox(
                    width: MediaQuery.of(context).size.width / 2.1,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.fromLTRB(0, 0, 0, 5),
                          child: Text(
                            'Tools',
                            style: AppTextStyles.detailHeading,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 0, 15, 5),
                          child: taskDetails['toolsRequired'] == null ||
                                  taskDetails['toolsRequired'].isEmpty
                              ? const Text('N/A',
                                  style: AppTextStyles.detailItemTitle)
                              : Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: taskDetails['toolsRequired']
                                      .map<Widget>(
                                        (tool) => Text(
                                          tool,
                                          style: AppTextStyles.detailBodyText,
                                        ),
                                      )
                                      .toList(),
                                ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // member assigned
              const Padding(
                padding: EdgeInsets.fromLTRB(20, 20, 20, 5),
                child: Text(
                  'Assigned to',
                  style: AppTextStyles.detailHeading,
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(25, 5, 25, 5),
                child: Text(
                  taskDetails['assignedTo'].join(', '),
                  style: AppTextStyles.detailBodyText,
                ),
              ),

              // Task description
              const Padding(
                padding: EdgeInsets.fromLTRB(20, 20, 20, 5),
                child: Text(
                  'Description',
                  style: AppTextStyles.detailHeading,
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(25, 5, 25, 5),
                child: Text(
                  taskDetails['description'],
                  style: AppTextStyles.detailBodyText,
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
