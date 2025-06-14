package com.todo.todoapp.contoller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todo.todoapp.model.Task;
import com.todo.todoapp.repository.TaskRepository;

@RestController
@RequestMapping("api/todo")
@CrossOrigin(origins = "*") // Allows frontend on a different port to access backend
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // ✅ GET: List all tasks
    @GetMapping("/get/tasks")
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // ✅ POST: Create a new task
    @PostMapping("/save/task")
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    // ✅ PUT: Update (or mark as completed)
    @PutMapping("/update/task/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            if (updatedTask.getTitle() != null) task.setTitle(updatedTask.getTitle());
            if (updatedTask.getDueDate() != null) task.setDueDate(updatedTask.getDueDate());
            if (updatedTask.getDescription() != null) task.setDescription(updatedTask.getDescription());

            task.setCompleted(updatedTask.isCompleted());

            if (updatedTask.isCompleted()) {
                task.setCompletedAt(LocalDateTime.now());
            } else {
                task.setCompletedAt(null);
            }

            return taskRepository.save(task);
        })
        .orElseThrow(() -> new RuntimeException("Task not found with id " + id));
    }

    // ✅ DELETE: Delete a task
    @DeleteMapping("/delete/task/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}