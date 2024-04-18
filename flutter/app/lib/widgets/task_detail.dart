import 'package:app/network/dio_client.dart';
import 'package:flutter/material.dart';
import 'package:app/data/fetch_task_data.dart';
import 'package:app/data/mock_data/task_mock_data.dart';
import 'package:app/style/text_style.dart';

class TaskDetail extends StatelessWidget {
  final AppTextStyles textStyle = AppTextStyles();
  final String taskId;
  final TasksDataProvider tasksProvider;

  TaskDetail({
    Key? key,
    required this.taskId,
  })  : tasksProvider =
            TasksDataProvider(tasks: taskMockData, dioClient: DioClient()),
        super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Task Detail'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: tasksProvider.getTaskById(taskId),
        builder: (BuildContext context,
            AsyncSnapshot<Map<String, dynamic>> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else if (snapshot.hasData) {
            var taskDetails = snapshot.data!;
            return SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    buildTaskDetailSection('Task ID', taskId),
                    buildTaskDetailSection('Task Title', taskDetails['title'],
                        isTitle: true),
                    buildTaskDetailSection('Status', taskDetails['status'],
                        isColored: true),
                    buildTaskDetailSection('Location', taskDetails['location']),
                    buildTaskDetailSection(
                        'Description', taskDetails['description']),
                    buildAssignedToSection(taskDetails['assignedTo']),
                  ],
                ),
              ),
            );
          } else {
            return const Center(child: Text("No data available"));
          }
        },
      ),
    );
  }

  Widget buildTaskDetailSection(String label, String value,
      {bool isTitle = false, bool isColored = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Text(
        isTitle ? value : '$label: $value',
        style: isColored
            ? AppTextStyles.detailItemTitle.copyWith(
                color: value == 'Complete' ? Colors.green : Colors.red)
            : (isTitle
                ? AppTextStyles.detailTitle
                : AppTextStyles.detailItemTitle),
      ),
    );
  }

  Widget buildAssignedToSection(List<dynamic> assignedToList) {
    List<Widget> names = assignedToList.map((user) {
      // Check if user data is a string or a map
      if (user is Map<String, dynamic>) {
        return Text(user['fullName'] + ' (' + user['role'] + ')',
            style: AppTextStyles.detailBodyText);
      } else if (user is String) {
        return Text(user,
            style: AppTextStyles
                .detailBodyText); // Handle case where user is just a string
      } else {
        return const SizedBox
            .shrink(); // Return an empty widget for unexpected data types
      }
    }).toList();

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Assigned to:', style: AppTextStyles.detailHeading),
          ...names,
        ],
      ),
    );
  }
}
