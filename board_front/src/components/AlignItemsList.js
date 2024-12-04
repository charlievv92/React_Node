import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default function AlignItemsList({ items }) {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {items.map((item) => (
        <React.Fragment key={item.comment_id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              //   primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "text.primary", display: "inline" }}
                  >
                    {item.email}
                  </Typography>
                  {` — ${item.comment}`}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}
