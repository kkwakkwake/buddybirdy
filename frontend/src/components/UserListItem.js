import { Avatar } from "@chakra-ui/avatar";


const UserListItem = ({ user, handleFunction }) => {

  return (
    <div className='bg-slate-100 hover:bg-yellow-100 cursor-pointer w-full flex items-center text-black px-1 py-3 mb-1 mt-3 rounded-md'
      onClick={handleFunction}
    >
      <Avatar className='mx-2 cursor-pointer'
        size="sm"
        name={user.name}
        src={user.pic}
      />
      <div>
        <h3 className='text-ml'>{user.name}</h3>
        <span>
          <b className='text-xs'>Email : </b>
          {user.email}
        </span>
      </div>
    </div>
  );
};

export default UserListItem;