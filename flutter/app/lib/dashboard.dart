import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import 'package:app/widgets/task_card.dart';
import 'package:app/network/dio_client.dart';

class Dashboard extends StatefulWidget {
  const Dashboard({super.key});
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late DioClient dioClient;
  String shiftStatus = "Not on Shift";
  List<Map<String, dynamic>> todayShifts = [];
  List<Map<String, dynamic>> onGoingTasks = [];
  List<Map<String, dynamic>> completedTasks = [];
  List<Map<String, dynamic>> newTasks = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    dioClient = DioClient();
    fetchData();
  }

  void fetchData() async {
    fetchShiftData();
    fetchTaskData();
  }

  Future<void> fetchShiftData() async {
    try {
      Response response = await dioClient.fetchStudentStaff(selfOnly: true);
      if (response.data['results'][0]['isOnCurrentShift']) {
        shiftStatus = "On Shift";
      } else {
        shiftStatus = "Not on Shift";
      }
      todayShifts = List<Map<String, dynamic>>.from(
          response.data['results'][0]['shifts']);
      setState(() {});
    } catch (e) {
      print('Error fetching shift data: $e');
    }
  }

  Future<void> fetchTaskData() async {
    try {
      Response response = await dioClient.fetchTasks(ownOnly: true);
      var fetchedTasks =
          List<Map<String, dynamic>>.from(response.data['results']);
      onGoingTasks =
          fetchedTasks.where((task) => task['status'] == 'pending').toList();
      newTasks = fetchedTasks.where((task) => task['status'] == 'new').toList();
      completedTasks =
          fetchedTasks.where((task) => task['status'] == 'completed').toList();
      setState(() {});
    } catch (e) {
      print('Error fetching task data: $e');
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'On Going'),
            Tab(text: 'New'),
            Tab(text: 'Completed'),
          ],
          indicatorColor: Theme.of(context).colorScheme.secondary,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // On Going Tasks view
          buildTaskListView(onGoingTasks),
          // New Tasks view
          buildTaskListView(newTasks),
          // Completed Tasks view
          buildTaskListView(completedTasks),
        ],
      ),
    );
  }

  Widget buildTaskListView(List<Map<String, dynamic>> tasks) {
    return SingleChildScrollView(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
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
          if (todayShifts.isNotEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  'Shifts from ${todayShifts.map((shift) {
                    return "${DateFormat.jm().format(DateTime.parse(shift['startTime']))} to ${DateFormat.jm().format(DateTime.parse(shift['endTime']))}";
                  }).join(', ')}',
                  style: const TextStyle(
                      fontSize: 16, fontWeight: FontWeight.w500),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          for (var task in tasks)
            TaskCard(
              taskId: task['_id'],
              title: task['title'],
              dueDate: DateFormat.yMMMd()
                  .format(DateTime.parse(task['dateCreated'])),
              tag: task['status'], // Assuming 'status' can act as a 'tag'
              comments: List<String>.from(task['comments'] ?? []),
            ),
        ],
      ),
    );
  }
}
