class App {
    static lists;
    constructor() { }
    static addList(list, todo) {
        todo = [];
        if (!list) {
            swal("You must give a name to a list")
            return "You must give a name to a list"
        }
        this.lists = JSON.parse(localStorage.getItem("lists"));
        if (this.lists != null && this.lists.length != 0) {
            if (this.lists.indexOf(list) === -1) {
                let lists = this.lists;

                lists.push(list);

                localStorage.setItem("lists", JSON.stringify(lists));
                swal({
                    title: "Added Successfully!",
                    text: "You clicked the button!",
                    icon: "success",
                    button: "Aww yiss!",
                });
            } else {
                swal("Duplicates are not allowed!");
            }
        } else {
            this.lists = [list];
            localStorage.setItem("lists", JSON.stringify(this.lists));

            localStorage.setItem(list, JSON.stringify(todo));
            swal({
                title: "Added Successfully!",
                text: "You clicked the button!",
                icon: "success",
                button: "Aww yiss!",
            });
        }
    }

    static addTask(list, task) {
        if (!task) {
            swal("You must give a name to a task")
            return "You must give a name to a task"
        }
        let todo = [];
        if (JSON.parse(localStorage.getItem(list))) {
            todo = JSON.parse(localStorage.getItem(list));
            todo.push(task);
            localStorage.setItem(list, JSON.stringify(todo));
                                swal({
                        title: "Added Successfully!",
                        text: "You clicked the button!",
                        icon: "success",
                        button: "Aww yiss!",
                    });
        } else {
            todo.push(task);
            localStorage.setItem(list, JSON.stringify(todo));
        }
    }

    static deleteList(list) {
        localStorage.removeItem(list);
        this.lists = JSON.parse(localStorage.getItem("lists"));
        this.lists.splice(this.lists.indexOf(list), 1);
        localStorage.setItem("lists", JSON.stringify(this.lists));
    }

    static deleteTask(list, taskIndex) {
        let todo = JSON.parse(localStorage.getItem(list));

        todo.splice(taskIndex, 1);

        localStorage.setItem(list, JSON.stringify(todo));
    }
    static numberOfLists() {
        let numberOfLists = JSON.parse(localStorage.getItem("lists"));
        if (numberOfLists) {
            return numberOfLists.length;
        } else {
            return 0;
        }
    }

    static appData() {
        let data = [];
        this.lists = JSON.parse(localStorage.getItem("lists"));
        if (this.lists) {
            for (let i = 0; i < this.lists.length; i++) {
                let listData = {};
                listData = {
                    listName: this.lists[i],
                    listTasks: JSON.parse(localStorage.getItem(this.lists[i]))
                };
                data.push(listData);
            }
        }
        return data;
    }
}

class AppController {
    constructor() { }
    static showData() {
        let html = "";
        let lists = App.appData();
        for (let i = 0; i < lists.length; i++) {
            html +=
                "<div class='tasks listLayout'><a href='#'><h1 id='list" +
                i +
                "'><span style='transform:scale(0.6);' class='glyphicon glyphicon-th-list'></span>" +
                lists[i]["listName"] +
                "</h1></a><button class='delete btn btn-danger' id='delete" +
                i +
                "' name='" +
                lists[i]["listName"] +
                "'  type='submit'><span class='glyphicon glyphicon-remove'></span></button></div><div class='hideElements' id='tasks" +
                i +
                "'>";

            if (lists[i]["listTasks"]) {
                for (let j = 0; j < lists[i]["listTasks"].length; j++) {
                    html += "<div class='tasks listLayout'><h4>" + lists[i]["listTasks"][j] + "</h4><button style='transform:scale(0.7);' class='delete btn btn-danger' data-index='" + j + "' id='" + lists[i]["listName"] + j +
                        "' name='" + lists[i]["listName"] + "'  type='submit'><span class='glyphicon glyphicon-remove'></span></button></div>";
                }
            }
            html +=
                "<div class='listLayout'><input class='form-control' id='input" +
                i +
                "' type='text'><input class='delete btn btn-primary' value='Add new task' type='submit' id='button" +
                i +
                "' name='" +
                lists[i]["listName"] +
                "' ></div></div>";
        }
        html += "<hr>";
        html +=
            "<div class='listLayout'><input class='form-control' id='addListInput' type='text' required><button class='delete btn btn-primary' id='addList' type='submit'><span class='glyphicon glyphicon-plus'></span> Add New List </button></div>";
        document.getElementById("root").innerHTML = html;
    }

    static addListeners() {
        let numberOfLists = App.numberOfLists();
        if (numberOfLists) {
            for (let i = 0; i < numberOfLists; i++) {
                let id1 = "list" + i + ""
                let id2 = "tasks" + i + ""
                let id3 = "input" + i + ""
                let id4 = "button" + i + ""
                let id5 = "delete" + i + ""

                document.getElementById(id1).onclick = function () {
                    document.getElementById(id2).classList.toggle("showOnClick");
                };
                document.getElementById(id4).onclick = function () {
                    let list = document.getElementById(id4).getAttribute("name");
                    let task = document.getElementById(id3).value;
                    App.addTask(list, task)
                    AppController.showData();
                    AppController.addListeners();
                    AppController.addChildListeners()
                };
                document.getElementById(id5).onclick = function () {

                    swal({
                        title: "Are you sure?",
                        text: "Once deleted, you will not be able to recover this list!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                let list = document.getElementById(id5).getAttribute("name");
                                App.deleteList(list);
                                AppController.showData();
                                AppController.addListeners();
                                AppController.addChildListeners()
                                swal("Poof! Your list has been deleted!", {
                                    icon: "success",
                                });
                            } else {
                                swal("Your list is safe!");
                            }
                        });

                };

                document.getElementById("addList").onclick = function () {
                    let list = document.getElementById("addListInput").value;
                    App.addList(list);
                    AppController.showData();
                    AppController.addListeners();
                    AppController.addChildListeners()
                };
            }
        } else {
            document.getElementById("addList").onclick = function () {
                let list = document.getElementById("addListInput").value;
                App.addList(list);
                AppController.showData();
                AppController.addListeners();
                AppController.addChildListeners()
            };
        }
    }

    static addChildListeners() {

        let lists = App.appData();

        if (lists) {

            for (let i = 0; i < lists.length; i++) {

                if (lists[i]["listTasks"]) {
                    for (let j = 0; j < lists[i]["listTasks"].length; j++) {
                        let id6 = "" + lists[i]['listName'] + j + ""

                        document.getElementById(id6).onclick = function () {
                            swal({
                                title: "Are you sure?",
                                text: "Once deleted, you will not be able to recover this task!",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            })
                                .then((willDelete) => {
                                    if (willDelete) {
                                        let list = document.getElementById(id6).getAttribute("name")
                                        let taskIndex = document.getElementById(id6).dataset.index
                                        App.deleteTask(list, taskIndex)
                                        AppController.showData()
                                        AppController.addListeners()
                                        AppController.addChildListeners()
                                        swal("Poof! Your task has been deleted!", {
                                            icon: "success",
                                        });
                                    } else {
                                        swal("Your task is safe!");
                                    }
                                });

                        };
                    }

                }
            }
        }
    }
}

AppController.showData();
AppController.addListeners();
AppController.addChildListeners();
