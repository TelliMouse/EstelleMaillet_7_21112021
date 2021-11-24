<template>
    <div>
        <label for="firstname">Prénom:</label>
        <input type="text" name="firstname">
        <label for="lastname">Nom:</label>
        <input type="text" name="lastname">
        <label for="email">Email:</label>
        <input type="email" name="email">
        <p>Vous ne pouvez utiliser votre adresse email qu'une seule fois pour créer un compte</p>
        <label for="password">Mot-de-passe:</label>
        <input type="password" name="password">
        <button>S'inscrire</button>
    </div>
</template>

<script>
export default {
    name: "FormSignup"
}
</script>

<style></style>