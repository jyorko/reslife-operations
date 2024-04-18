import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:app/network/dio_client.dart';
import 'package:app/data/fetch_task_data.dart';
import 'package:app/data/mock_data/task_mock_data.dart';
import 'package:app/style/text_style.dart';

class TaskDetail extends StatefulWidget {
  final String taskId;

  TaskDetail({Key? key, required this.taskId}) : super(key: key);

  @override
  _TaskDetailState createState() => _TaskDetailState();
}

class _TaskDetailState extends State<TaskDetail> {
  late final TasksDataProvider tasksProvider;
  String? currentStatus;

  @override
  void initState() {
    super.initState();
    tasksProvider = TasksDataProvider(
      tasks: taskMockData,
      dioClient: DioClient(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Task Detail'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: tasksProvider.getTaskById(widget.taskId),
        builder: (BuildContext context,
            AsyncSnapshot<Map<String, dynamic>> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else if (snapshot.hasData) {
            var taskDetails = snapshot.data!;
            if (currentStatus == null) {
              currentStatus = taskDetails['status'];
            }
            return SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Text('Task ID: ${widget.taskId}',
                        style: TextStyle(
                            fontStyle: FontStyle.italic,
                            color: Colors.grey[600])),
                    const SizedBox(height: 20),
                    Text('Task Title: ${taskDetails['title']}',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('Status: $currentStatus',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('Location: ${taskDetails['location']}',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('Description: ${taskDetails['description']}',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 20),
                    ...buildAssignedToSection(taskDetails['assignedTo']),
                    const SizedBox(height: 200),
                    const Text('Update Status:',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 10),
                    GridView.count(
                      shrinkWrap: true,
                      crossAxisCount: 2,
                      childAspectRatio: 3,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      children: [
                        'pending',
                        'in progress',
                        'completed',
                        'unable to complete'
                      ]
                          .map((status) => buildStatusButton(
                              context,
                              currentStatus!,
                              status,
                              statusIcons[status]!,
                              statusColors[status]!))
                          .toList(),
                    ),
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

  List<Widget> buildAssignedToSection(List<dynamic> assignedToList) {
    return assignedToList.map((user) {
      return Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Text(
          user is Map<String, dynamic>
              ? '${user['fullName']} (${user['role']})'
              : user.toString(),
          style: TextStyle(color: Colors.black54),
        ),
      );
    }).toList();
  }

  Widget buildStatusButton(BuildContext context, String currentStatus,
      String newStatus, IconData icon, Color color) {
    bool isCurrent = currentStatus == newStatus;
    return ElevatedButton.icon(
      icon: Icon(icon),
      label: Text(newStatus),
      onPressed: !isCurrent
          ? () async {
              try {
                final response = await tasksProvider.updateTaskStatus(
                    widget.taskId, newStatus);
                if (response.statusCode == 200) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text('Task status updated to $newStatus'),
                  ));
                  setState(() {
                    this.currentStatus =
                        newStatus; // Update current status on success
                  });
                } else {
                  final message =
                      response.data['message'] ?? 'Failed to update status';
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text(message),
                  ));
                }
              } catch (e) {
                if (e is DioException) {
                  final errorMessage = e.response?.data['message'] ??
                      'An unknown error occurred';
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text('Failed to update status: $errorMessage'),
                  ));
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text(
                        'Failed to update status: An unexpected error occurred'),
                  ));
                }
              }
            }
          : null, // Disable the button if the current status matches the new status
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        disabledBackgroundColor: Colors.grey,
        textStyle: const TextStyle(fontSize: 16),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      ),
    );
  }
}

// Assuming statusIcons and statusColors are defined globally or within the class
final Map<String, IconData> statusIcons = {
  'pending': Icons.hourglass_empty,
  'in progress': Icons.loop,
  'completed': Icons.check_circle_outline,
  'unable to complete': Icons.cancel_outlined,
};

final Map<String, Color> statusColors = {
  'pending': Colors.orange,
  'in progress': Colors.blue,
  'completed': Colors.green,
  'unable to complete': Colors.red,
};
