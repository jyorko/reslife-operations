import 'package:app/data/fetch_task_data.dart';
import 'package:flutter/material.dart';
import 'package:app/widgets/task_card.dart';
import 'package:app/data/mock_data/task_mock_data.dart';

class Dashboard extends StatefulWidget {
  const Dashboard({super.key});
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  TasksDataProvider tasksProvider = TasksDataProvider(tasks: taskMockData);

  // TODO: implement fetching user shift status
  String shiftStatus = "On Shift";

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Tasks filtered by the user name and status selected in the tabs
    List<Map<String, dynamic>> onGoingTasks =
        tasksProvider.getFilteredTasks("On-Going");
    List<Map<String, dynamic>> completedTasks =
        tasksProvider.getFilteredTasks("Complete");
    List<Map<String, dynamic>> newTasks =
        tasksProvider.getFilteredTasks("On-Hold");

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(
              text: 'On Going',
            ),
            Tab(
              text: 'Upcoming',
            ),
            Tab(
              text: 'Completed',
            ),
          ],
          indicatorColor: Theme.of(context).colorScheme.secondary,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // On Going Tasks
          SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
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
              ],
            ),
          ),
          // New Tasks
          SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                for (var task in newTasks)
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
          // Completed Tasks
          SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                for (var task in completedTasks)
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
        ],
      ),
    );
  }
}
