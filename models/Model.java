package models;
import java.util.ArrayList;

import entities.User;

public class Model{
    private ArrayList<User> users;

    public Model(){
        this.users = new ArrayList<User>();
    }

    public ArrayList<User> getUsers(){
        return users;
    }
    public void setUsers(ArrayList<User> x){
        this.users = x;
    }

    public void addUser(User u){
        users.add(u);
        System.out.println("New user added!");
    }
    public boolean searchUser(User u){
        for(User i: users){
            if(i == u){
                System.out.println("Found user!");
                return true;
            }
        }
        return false;
    }
}