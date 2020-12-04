<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Validator\Validator\ValidatorInterface;


class SecurityController extends AbstractController
{
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager=$manager;
    }
    /**
     * @Route("/login", name="studentLogin")
     */
    public function studentLogin(AuthenticationUtils $authenticationUtils): Response
    {
         if ($this->getUser()) {
             $this->addFlash('success',"Authentification réussie !");
             return $this->redirectToRoute('home');
         }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();
        if($error){
            $this->addFlash('error',$error->getMessageKey());
        }

        return $this->render('security/student/login.html.twig', ['last_username' => $lastUsername]);
    }
    /**
     * @Route("/register", name="studentRegister")
     */
    public function studentRegister(Request $request, UserPasswordEncoderInterface $passwordEncoder,MailerInterface $mailer,ValidatorInterface $validator): Response
    {
        if($this->getUser()){
            return $this->redirectToRoute("home");
        }
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            if( !$form->isValid()){
                $errors=$validator->validate($form);
                foreach ($errors as $error){
                   $this->addFlash('error',$error->getMessage());
               }
               $form->clearErrors(true);

            }else{
                $user->setPassword(
                    $passwordEncoder->encodePassword(
                        $user,
                        $form->get('password')->getData()
                    )
                );
                $user->setRoles(array('ROLE_STUDENT'));
                $random = random_bytes(32);
                $user->setConfirmationToken(base64_encode($random));
                $this->manager->persist($user);
                $this->manager->flush();
                $email=base64_encode(base64_encode(base64_encode(base64_encode($user->getEmail()))));
                $confirmationToken=base64_encode(base64_encode(base64_encode(base64_encode($user->getConfirmationToken()))));
                $email = (new TemplatedEmail())
                    ->from('admin@library.com')
                    ->to($user->getEmail())
                    ->subject('Vérifcation email')
                    ->htmlTemplate('security/student/mail/confirmation_email.html.twig')
                    ->context([
                        'encodedEmail' =>$email,
                        'confirmationToken'=>$confirmationToken
                    ]);
                $mailer->send($email);

                // do anything else you need here, like send an email
                $this->addFlash('warning',"Inscription avec succès, SVP Confirmer votre email !");

                return $this->redirectToRoute('studentLogin');
            }

        }

        return $this->render('security/student/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }

    /**
     * @Route("/verify/email/{email}/{confirmationToken}", name="StudentVerifyEmail",methods={"GET"})
     */

    public function verifyStudentEmail($email,$confirmationToken): Response
    {
        $email=base64_decode(base64_decode(base64_decode(base64_decode($email))));
        $confirmationToken=base64_decode(base64_decode(base64_decode(base64_decode($confirmationToken))));
        $user=$this->manager->getRepository(User::class)->findOneBy([
            'email'=>$email,
        ]);
        if($user){
            if( $user->getConfirmationToken()==$confirmationToken){
                if($user->isVerified()){
                    $this->addFlash('warning', 'Votre email a déjà vérifier.');
                    return $this->redirectToRoute('studentLogin');
                }else{
                    $user->setIsVerified(true);
                    $user->setConfirmationToken('');
                    $this->manager->flush();

                    $this->addFlash('success', 'Votre email à été vérifié avec succès, vous pouvez connecté maintenant.');
                    return $this->redirectToRoute('studentLogin');
                }
            }else{
                $this->addFlash('warning', 'Ce lien n\'est pas valide');
                return $this->redirectToRoute('home');
            }

        }
        $this->addFlash('error', 'Utilisateur inexistant');

        return $this->redirectToRoute('home');
    }

    /**
     * @Route("/common/login", name="commonLogin")
     */
    public function CommonLogin(AuthenticationUtils $authenticationUtils): Response
    {
         if ($this->getUser()) {
             if($this->isGranted("ROLE_ADMIN")){
                 $this->addFlash('success',"Authentification réussie !");
                 return $this->redirectToRoute('showAdminDashboard');
             }elseif($this->isGranted("ROLE_LIBRARIAN")){
                 $this->addFlash('success',"Authentification réussie !");
                 return $this->redirectToRoute('showLibrarianDashboard');
             }else{
                 $this->addFlash('error','Vous n\'avez pas l\'autorisation d\'accéder a cet espace !');
                 return $this->redirectToRoute('home');
             }
         }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();
        if($error){
            $this->addFlash('error',$error->getMessageKey());
        }

        return $this->render('security/common/login.html.twig', ['last_username' => $lastUsername]);
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout()
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }


}
