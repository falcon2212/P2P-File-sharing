package entities;

public class User{
    private String first_name;
    private String last_name;
    private String email;
    private String password;
    private String username;

    public User(){
        this.username = "anonymous";
    }
    public User(String username, String password){
        this.username = username;
        this.password = password;
    }

    public String getFirst_name(){
        return first_name;
    }
    public void setFirst_name(String x){
        this.first_name = x;
    }

    public String getLast_name(){
        return last_name;
    }
    public void setLast_name(String x){
        this.last_name = x;
    }

    public String getEmail(){
        return email;
    }
    public void setEmail(String x){
        this.email = x;
    }

    public String getPassword(){
        return password;
    }
    public void setPassword(String x){
        this.password = x;
    }

    public String getUsername(){
        return username;
    }
    public void setUsername(String x){
        this.username = x;
    }

    @Override
    public boolean equals(Object obj){
        if(this == obj) return true;
        if(obj == null || obj.getClass()!= this.getClass()) return false;
        User u = (User) obj;
        return (u.username == this.username && u.password == this.password);
    }
}