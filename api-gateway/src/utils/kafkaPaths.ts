export async function kafkaPath(client){
    client.subscribeToResponseOf('add.new.challengeType');
    client.subscribeToResponseOf('get.challengesType.list');
    client.subscribeToResponseOf('getById.challengeType');
    client.subscribeToResponseOf('updateById.challengeType');
    client.subscribeToResponseOf('deleteById.challengeType');
    client.subscribeToResponseOf('add.new.badge');
    client.subscribeToResponseOf('get.badges.list');
    client.subscribeToResponseOf('getById.badge');
    client.subscribeToResponseOf('updateById.badge');
    client.subscribeToResponseOf('deleteById.badge');

    await client.connect();
}