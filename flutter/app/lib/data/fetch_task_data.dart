/// A class for managing and providing access to a list of tasks.
///
/// Each task is represented as a map containing properties such as task ID, title,
/// status, assigned individuals, and more. This class allows for the retrieval of
/// tasks, either all at once or filtered by specific criteria like status or assigned
/// individuals. It also provides the ability to fetch details of a specific task by its ID.
///
/// Usage:
/// ```dart
/// var tasksDataProvider = TasksDataProvider(tasks: yourListOfTasks);
/// var allTasks = tasksDataProvider.allTasks;
/// var filteredTasks = tasksDataProvider.getFilteredTasks('On-Going', ['Alice']);
/// var taskDetails = tasksDataProvider.getTaskById(1);
/// ```
class TasksDataProvider {
  final List<Map<String, dynamic>> _tasks;

  /// Constructs a `TasksDataProvider` with a given list of tasks.
  ///
  /// The tasks should be provided as a list of maps, where each map represents
  /// a task and includes properties like ID, title, status, etc.
  ///
  /// Parameters:
  /// - `tasks`: The list of tasks to be managed by this provider.
  TasksDataProvider({
    required List<Map<String, dynamic>> tasks,
  }) : _tasks = tasks;

  /// Returns:
  /// A list containing all tasks managed by this provider.
  List<Map<String, dynamic>> get allTasks => _tasks;

  /// If `assignedTo` is provided, only tasks that have at least one matching name in their
  /// `assignedTo` list will be included in the result.
  ///
  /// Parameters:
  /// - `status`: The status to filter tasks by.
  /// - `assignedTo`: Optional. A list of names to further filter tasks by their assigned individuals.
  ///
  /// Returns:
  /// A list of tasks that match the given status and, if provided, are assigned to at least one of the given individuals.
  List<Map<String, dynamic>> getFilteredTasks(String status, [List<String>? assignedTo]) {
    return _tasks.where((task) {
      final bool statusMatches = task['status'] == status;
      final bool assignedMatches = assignedTo == null || assignedTo.any((name) => task['assignedTo'].contains(name));
      return statusMatches && assignedMatches;
    }).toList();
  }

  /// Provides the details of a task by its unique identifier.
  ///
  /// Searches through the list of tasks and returns the task whose `id` matches
  /// the provided `id` parameter. If no task with the given `id` is found, a `StateError` is thrown.
  ///
  /// Parameters:
  /// - `id`: An integer representing the unique identifier of the task to be retrieved.
  ///
  /// Returns:
  /// A map containing the details of the task with the specified `id`.
  ///
  /// Throws:
  /// - `StateError`: If no task with the given `id` is found in the list of tasks.
  Map<String, dynamic> getTaskById(String id) {
    return _tasks.firstWhere((task) => task["id"] == id);
  }
}
