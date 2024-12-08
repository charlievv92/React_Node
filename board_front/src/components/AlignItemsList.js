import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function AlignItemsList({ items }) {
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        height: "95%",
      }}
    >
      {items.length === 0 && (
        <ListItem
          alignItems="center"
          sx={{
            mb: 2, // 아이템 간의 간격 설정
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: "text.primary",
                display: "inline",
              }}
            >
              댓글이 없습니다.
            </Typography>
          </Box>
        </ListItem>
      )}
      {items.length > 0 &&
        items.map((item) => (
          <React.Fragment key={item.comment_id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                bgcolor: "white",
                mt: 2,
                mb: 2, // 아이템 간의 간격 설정
                borderRadius: 1, // 모서리 둥글게 설정 (선택 사항)
                boxShadow: 1, // 그림자 효과 (선택 사항)
              }}
            >
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
                    {/* <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "text.primary", display: "inline" }}
                    >
                      {item.ip_location}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "text.primary", display: "inline" }}
                    >
                      {item.publish_date}
                    </Typography> */}
                  </React.Fragment>
                }
              />
            </ListItem>
            {/* <Divider variant="inset" component="li" /> */}
          </React.Fragment>
        ))}
    </List>
  );
}
