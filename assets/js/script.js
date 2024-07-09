// Retrieve tasks and nextId from localStorage
// Array created to contain tasks"tasklist
// Use the next available task id "nextID"
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


// Use next id available.
function generateTaskId() {
    return nextId++;
}

// Create task Cards
function createTaskCard(task) {
  const dueDate = dayjs(task.dueDate);
  const currentDate = dayjs();
  const isOverdue = dueDate.isBefore(currentDate);
  const isNearingDeadline = dueDate.diff(currentDate, 'day') <= 2 && !isOverdue;
  
  let cardClass = '';

  
  
    if (isOverdue) {
      cardClass = 'bg-danger text-black';
    } else if (isNearingDeadline) {
      cardClass = 'bg-warning';
    }
  
    return `
      <div class="card mb-3 ${cardClass}" data-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
          <button class="btn btn-danger btn-sm delete-task">Delete</button>
        </div>
      </div>
    `;
    

}

// function to render the task list and make cards draggable
function renderTaskList() {
  ['todo', 'in-progress', 'done'].forEach(status => {
    $(`#${status}-cards`).empty();
    taskList.filter(task => task.status === status).forEach(task => {
      const taskCard = createTaskCard(task);
      const $taskCard = $(taskCard); // Convert to jQuery object

      // Make it draggable
      $taskCard.addClass('draggable-task');

      // add cardr to lane
      $(`#${status}-cards`).append($taskCard);

      
      $taskCard.draggable({
        revert: 'invalid',
        start: function() {
          $(this).css('z-index', 1000);
        },
        stop: function() {
          $(this).css('z-index', '');
        }
      });
      if (status === 'done') {
        $taskCard.removeClass('bg-danger bg-warning');
      }
    });
  });
// Delete
  $('.delete-task').click(handleDeleteTask);
}




// function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
  const title = $("#task-title").val();
  const description = $("#task-description").val();
  const dueDate = $("#task-due-date").val();

  const newTask = {
      id: generateTaskId(),
      title: title,
      description: description,
      dueDate: dueDate,
      status: "todo"
  };
  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));

  renderTaskList();

  const addTaskForm = $("#add-task-form");
  if (addTaskForm.length > 0) {
      addTaskForm[0].reset();
  }

  $("#formModal").modal("hide");

}

// function to handle deleting a task
    function handleDeleteTask(event) {
        const taskId = $(event.target).closest('.card').data('id');
        taskList = taskList.filter(task => task.id !== taskId);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
}

// function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');
    const newStatus = $(this).attr('id').replace('-cards', '');

    taskList = taskList.map(task => {
        if (task.id === taskId) {
          task.status = newStatus;
        }
        return task;
      });
// Update Local storage
      localStorage.setItem("tasks", JSON.stringify(taskList));
      renderTaskList();
}

// when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    ['#todo-cards', '#in-progress', '#done'].forEach(function (status) {
      $(status).droppable({
        accept: '.draggable-task',
        drop: handleDrop
      });
    });
  
    $('#add-task-form').submit(handleAddTask);
  
    // add date picker
    $('#task-due-date').datepicker({
      dateFormat: 'yy-mm-dd'
    });
  });
    
     