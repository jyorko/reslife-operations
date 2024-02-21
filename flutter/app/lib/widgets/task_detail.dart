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
                padding: EdgeInsets.fromLTRB(20, 5, 20, 10),
                child: Text(
                  taskDetails['title'],
                  style: AppTextStyles.titleOnDetailStyle,
                ),
              ),

              // Leading content
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
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
                          style: AppTextStyles.subTitleStyle,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 0, 0, 5),
                        child: Text(
                          taskDetails['location'],
                          style: AppTextStyles.leadingContentStyle,
                        ),
                      ),
                      // Task due date
                      const Padding(
                        padding: EdgeInsets.fromLTRB(0, 5, 0, 5),
                        child: Text(
                          'Due Date',
                          style: AppTextStyles.subTitleStyle,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 0, 0, 5),
                        child: Text(
                          taskDetails['dueDate'],
                          style: AppTextStyles.leadingContentStyle,
                        ),
                      ),
                    ],
                  ),

                  // Right side: Tag, Members
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Padding(
                        padding: EdgeInsets.fromLTRB(0, 0, 0, 5),
                        child: Text(
                          'Tools',
                          style: AppTextStyles.subTitleStyle,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 0, 15, 5),
                        child: taskDetails['toolsRequired'] == null ||
                                taskDetails['toolsRequired'].isEmpty
                            ? const Text('N/A',
                                style: AppTextStyles.contentStyle)
                            : Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: taskDetails['toolsRequired']
                                    .map<Widget>((tool) => Text(tool,
                                        style:
                                            AppTextStyles.contentStyle))
                                    .toList(),
                              ),
                      ),

                      // member assigned
                      // const Padding(
                      //   padding: EdgeInsets.fromLTRB(0, 0, 0, 5),
                      //   child: Text(
                      //     'Assigned to',
                      //     style: AppTextStyles.subTitleStyle,
                      //   ),
                      // ),
                      // Padding(
                      //   padding: const EdgeInsets.fromLTRB(0, 0, 0, 5),
                      //   child: Column(
                      //     crossAxisAlignment: CrossAxisAlignment.start,
                      //     children: [
                      //       for (String member in taskDetails['assignedTo'])
                      //         Text(
                      //           member,
                      //           style: AppTextStyles.leadingContentStyle,
                      //         ),
                      //     ],
                      //   ),
                      // ),
                    ],
                  ),
                ],
              ),

              // member assigned
              const Padding(
                padding: EdgeInsets.fromLTRB(20, 20, 20, 5),
                child: Text(
                  'Assigned to',
                  style: AppTextStyles.subTitleStyle,
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(25, 5, 25, 5),
                child: Text(
                  taskDetails['assignedTo'].join(', '),
                  style: AppTextStyles.contentStyle,
                ),
              ),

              // Tools
              // const Padding(
              //   padding: EdgeInsets.fromLTRB(20, 20, 20, 5),
              //   child: Text(
              //     'Tools',
              //     style: AppTextStyles.subTitleStyle,
              //   ),
              // ),
              // Padding(
              //   padding: const EdgeInsets.fromLTRB(25, 5, 25, 5),
              //   child: Text(
              //     // Check if 'tools' is null or empty, and display "N/A" if true
              //     taskDetails['toolsRequired'] == null ||
              //             taskDetails['toolsRequired'].isEmpty
              //         ? 'N/A'
              //         // Join the list of tools with ', ' as separator
              //         : taskDetails['toolsRequired'].join(', '),
              //     style: AppTextStyles.contentStyle,
              //   ),
              // ),
              // Task description
              const Padding(
                padding: EdgeInsets.fromLTRB(20, 20, 20, 5),
                child: Text(
                  'Description',
                  style: AppTextStyles.subTitleStyle,
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(25, 5, 25, 5),
                child: Text(
                  taskDetails['description'],
                  style: AppTextStyles.contentStyle,
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
