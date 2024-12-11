import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, IconButton, Stack } from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";

export default function AlignItemsList({ items, user }) {
  const filteredItems = items.filter((item) => item.is_deleted === 0);
  console.log("filteredItems", filteredItems);

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 400,
        bgcolor: "background.paper",
        height: "90%",
      }}
    >
      {filteredItems.length === 0 && (
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
      {filteredItems.length > 0 &&
        filteredItems.map((item) => (
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
              secondaryAction={
                user &&
                user.email === item.email && (
                  <Stack
                    flexDirection="column"
                    // justifyContent="space-between"
                    // sx={{ width: "50px" }}
                  >
                    <IconButton
                      edge="end"
                      aria-label="modify"
                      onClick={() => {
                        alert(`${item.comment_id} is clicked`);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        alert(`${item.comment_id} is clicked`);
                      }}
                    >
                      <GridDeleteIcon />
                    </IconButton>
                  </Stack>
                )
              }
            >
              <ListItemText
                //   primary="Brunch this weekend?"
                secondary={
                  <Stack
                    flexDirection="column"
                    sx={{ width: "90%", minHeight: "70px" }}
                  >
                    <Stack
                      flexDirection="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ color: "text.primary", display: "inline" }}
                      >
                        {item.email}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: "GrayText", display: "inline" }}
                      >
                        {item.ip_location}
                      </Typography>
                    </Stack>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "GrayText", display: "inline" }}
                    >
                      {format(
                        new Date(item.publish_date),
                        "yyyy-MM-dd HH:mm:ss"
                      )}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body1"
                      sx={{ color: "text.primary", display: "inline" }}
                    >
                      {item.comment}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
            {/* <Divider variant="inset" component="li" /> */}
          </React.Fragment>
        ))}
    </List>
  );
}
