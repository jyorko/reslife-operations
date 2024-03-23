import 'package:flutter/material.dart';
import 'package:app/widgets/task_card.dart';
import 'package:app/data/fetch_task_data.dart';
import 'package:app/data/mock_data/task_mock_data.dart';

class TaskList extends StatefulWidget {
  const TaskList({super.key});
  @override
  _TaskListState createState() => _TaskListState();
}

class _TaskListState extends State<TaskList>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // TODO: replace task provider to API
  TasksDataProvider tasksProvider = TasksDataProvider(tasks: taskMockData);

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
    // Task lists filterd by their status
    List<Map<String, dynamic>> onGoingTasks =
        tasksProvider.getFilteredTasks("On-Going");
    List<Map<String, dynamic>> completedTasks =
        tasksProvider.getFilteredTasks("Complete");
    List<Map<String, dynamic>> onHoldTasks =
        tasksProvider.getFilteredTasks("On-Hold");

    return Scaffold(
      appBar: AppBar(
        title: const Text('Task List'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'On Going'),
            Tab(text: 'Upcoming'),
            Tab(text: 'Completed'),
          ],
          indicatorColor: Theme.of(context).colorScheme.secondary,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              // children: OnGoingTask().tasks(),
              children: [
                // Center(child: Text('On Going Tasks')),
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
          SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              // children: UpcomingTask().tasks(),
              children: [
                // Center(child: Text('Upcoming Tasks')),
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
          SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              // children: CompletedTask().tasks(),
              children: [
                // Center(child: Text('Completed Tasks')),
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
