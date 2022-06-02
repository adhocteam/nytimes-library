function Stats(props) {
  return (
    <div>
      {props.message} {props.userInfo.email}
    </div>
  )
}

export async function getServerSideProps(context) {
  // Pass data to the page via props
  console.log(context.req.userInfo)

  return {
    props: {
      data: [1, 2, 3],
      message: 'Hello, ',
      userInfo: context.req.userInfo
    }
  }
}

export default Stats
