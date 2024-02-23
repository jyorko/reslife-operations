import 'package:flutter/material.dart';
import 'package:app/widgets/task_detail.dart';
import 'package:app/style/text_style.dart';

class TaskCard extends StatelessWidget {
  // text style variables
  final AppTextStyles textStyle = AppTextStyles();

  final String taskId;
  final String title;
  final String dueDate;
  final String? tag;
  final List<String>? comments;

  TaskCard({
    Key? key,
    required this.taskId,
    required this.title,
    required this.dueDate,
    this.tag,
    this.comments,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => TaskDetail(taskId: taskId)),
        );
      },
      child: Card(
        margin: const EdgeInsets.fromLTRB(20, 10, 20, 10),
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Left side: Task id, title, due date, etc.
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Task ID: $taskId',
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.grey,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        vertical: 2.0,
                      ),
                      child: Text(
                        title,
                        style: AppTextStyles.cardTitle,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      'Due by $dueDate',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.black54,
                      ),
                    ),
                  ],
                ),
              ),

              // Right side: Tag, num of comments
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (tag != null) // Check if tag is not null
                    Padding(
                      padding: const EdgeInsets.all(10),
                      child: Text(
                        tag!,
                        style: const TextStyle(
                          fontSize: 14,
                        ),
                      ), // Display tag value
                    ),
                  Padding(
                    padding: const EdgeInsets.only(top: 5.0),
                    child: Text(
                      '${comments?.length ?? 0} comments',
                      style: const TextStyle(
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
